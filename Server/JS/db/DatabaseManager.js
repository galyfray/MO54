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
        const Tables = this._csv_parser.parse(path.join(this._folder, "Tables.csv"));
        const Columns = this._csv_parser.parse(path.join(this._folder, "Columns.csv"));
        const meta = {};
        for (let table of Tables) {
            for (let column of Columns) {
                if (column.table_id == table.id) {
                    if (!meta[table.TableName]) {
                        meta[table.TableName] = {};
                    }
                    meta[table.TableName][column.ColumnName] = column.type;
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
        const AST = NQLParser.parse(query);
        for (let node of AST.SELECT) {
            this._qualifyTable(node, AST.FROM);
        }
        const condition = this._interprateWhere(AST.WHERE);
        let data;
        try {
            data = await this._csv_parser.parse(path.join(this._folder, AST.FROM + ".csv"));
        } catch (e) {
            throw new Error(`Table ${AST.FROM} does not exist`);
        }
        return data.filter(condition);
    }

    _qualifyTable(node, table) {
        if (node.table == null) {
            if (self._meta[table][node.column] != null) {
                node.table = table;
            } else {
                throw new Error(`The column ${node.column} is not defined in the table ${table}`);
            }
        } else if (node.table != table) {
            throw new Error(`The table ${node.table} is not defined in the query`);
        }
    }

    _interprateWhere(where,table) {
        if (where == null) {
            return () => true;
        }
        if (where.type == "parenthesis") {
            return this._interprateWhere(where.value);
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
                let full_name, value, mapper = val => val;
                if (where.left.column) {
                    this._qualifyTable(where.left, table);
                    full_name = where.left.table + "." + where.left.column;
                    value = where.right;
                    if (where.right.column) {
                        throw new Error("Cannot compare two columns in a WHERE clause");
                    }
                    if (self._meta[table][where.left.column] != value.type) {
                        if (self._meta[table][where.left.column] == "date") {
                            mapper = val => new Date(val);
                        } else {
                            throw new Error(
                                `Type mismatch: ${self._meta[table][where.left.column]}\
                                 != ${value.type} for ${full_name}`
                            );
                        }
                    }
                    switch (where.operator) {

                    case "=":
                        return data => mapper(data[full_name]) == mapper(value.value);

                    case "!=":
                        return data => mapper(data[full_name]) != mapper(value.value);

                    case ">":
                        return data => mapper(data[full_name]) > mapper(value.value);

                    case "<":
                        return data => mapper(data[full_name]) < mapper(value.value);

                    case ">=":
                        return data => mapper(data[full_name]) >= mapper(value.value);

                    case "<=":
                        return data => mapper(data[full_name]) <= mapper(value.value);
                        
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
// - alterate the entries to use the name used in the query (unqualifyed in the query => unqualifyed in the result)


module.exports = DatabaseManager;