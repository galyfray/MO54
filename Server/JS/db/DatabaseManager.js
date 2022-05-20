const path = require("path");
const CSVParser = require("./CSVParser.js");
const NQLParser = require("./NQLParser.js");

class DatabaseManager {

    constructor(folder) {
        this._folder = folder;
        this._meta = {};
        this._init = false;
    }

    async init() {
        if (this._init) {
            return;
        }

        this._csv_parser = new CSVParser();
        this._meta = await this._loadMeta();

        this._init = true;
    }

    async _loadMeta() {
        const Tables = await this._csv_parser.parse(path.join(this._folder, "Tables.csv"));
        const Columns = await this._csv_parser.parse(path.join(this._folder, "Columns.csv"));
        const meta = {};
        for (let table of Tables) {
            for (let column of Columns) {
                if (column.table_id == table.id) {
                    if (!meta[table.name]) {
                        meta[table.name] = {};
                    }
                    meta[table.name][column.name] = column.type;
                }
            }
        }
        return meta;
    }

    _join(dataSet1, dataSet2, test) {
        const joined = [];
        for (let data1 of dataSet1) {
            for (let data2 of dataSet2) {
                if (test(data1, data2)) {
                    joined.push({
                        ...data1,
                        ...data2
                    });
                }
            }
        }
        return joined;
    }

    async get(query) {
        await this.init();

        const AST = NQLParser(query);

        for (let node of AST.SELECT) {
            this._qualifyTable(node, AST.FROM);
        }
        const mapper = this._makeSelectMapper(AST.SELECT);

        const condition = this._interprateWhere(AST.WHERE, AST.FROM);
        let data;

        try {
            data = await this._csv_parser.parse(path.join(this._folder, AST.FROM + ".csv"), AST.FROM + ".");
        } catch (e) {
            throw new Error(`Table ${AST.FROM} does not exist`);
        }

        return data.filter(condition).map(mapper);
    }

    _makeSelectMapper(SELECT) {
        const map = {};
        for (let node of SELECT) {
            if (node.table == null) {
                map[node.qualifyied] = node.column;
            } else {
                map[node.qualifyied] = node.qualifyied;
            }
        }
        return element => {
            let new_elem = {};

            for (let key in map) {
                new_elem[map[key]] = element[key];
            }

            return new_elem;
        };
    }

    _qualifyTable(node, table) {
        if (node.table == null) {
            if (this._meta[table][node.column] == null) {
                throw new Error(`The column ${node.column} is not defined in the table ${table}`);
            }
        } else if (node.table != table) {
            throw new Error(`The table ${node.table} is not defined in the query`);
        }

        node.qualifyied = table + "." + node.column;
    }

    _interprateWhere(where, table) {
        if (where == null) {
            return () => true;
        }
        if (where.type == "parenthesis") {
            return this._interprateWhere(where.value, table);
        }
        if (where.operator) {
            switch (where.operator) {
            case "AND": {
                const left = this._interprateWhere(where.left, table);
                const right = this._interprateWhere(where.right, table);
                return data => left(data) && right(data);
            }
            case "OR": {
                const left = this._interprateWhere(where.left, table);
                const right = this._interprateWhere(where.right, table);
                return data => left(data) || right(data);
            }
            default: {
                let value, mapper = val => val;
                if (where.left.column) {
                    this._qualifyTable(where.left, table);
                    value = where.right;
                    if (where.right.column) {
                        throw new Error("Cannot compare two columns in a WHERE clause");
                    }
                    if (this._meta[table][where.left.column] != value.type) {
                        if (this._meta[table][where.left.column] == "date") {
                            mapper = val => new Date(val);
                        } else {
                            throw new Error(
                                `Type mismatch: ${this._meta[table][where.left.column]}\
                                 != ${value.type} for ${where.left.qualifyied}`
                            );
                        }
                    }
                    switch (where.operator) {

                    case "=":
                        return data => mapper(data[where.left.qualifyied]) == mapper(value.value);

                    case "!=":
                        return data => mapper(data[where.left.qualifyied]) != mapper(value.value);

                    case ">":
                        return data => mapper(data[where.left.qualifyied]) > mapper(value.value);

                    case "<":
                        return data => mapper(data[where.left.qualifyied]) < mapper(value.value);

                    case ">=":
                        return data => mapper(data[where.left.qualifyied]) >= mapper(value.value);

                    case "<=":
                        return data => mapper(data[where.left.qualifyied]) <= mapper(value.value);

                    default:
                        throw new Error(`Unknown operator ${where.operator}`);
                    }
                } else {
                    let tmp = where.left;
                    where.left = where.right;
                    where.right = tmp;
                    switch (where.operator) {

                    case ">":
                        where.operator = "<";
                        break;

                    case "<":
                        where.operator = ">";
                        break;

                    case ">=":
                        where.operator = "<=";
                        break;

                    case "<=":
                        where.operator = ">=";
                        break;

                    default:

                        // Do nothing
                    }
                    return this._interprateWhere(where, table);
                }
            }
            }
        }
    }

}

// TODO :
// - Add support for joins
// - improove error handling
// - support IN, LIKE, NOT
// - reformat the code that interprete WHERE
// - add documentation


module.exports = DatabaseManager;