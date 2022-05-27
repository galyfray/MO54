const path = require("path");
const CSVParser = require("./CSVParser.js");
const {NQLParser} = require("./NQLParser.js");

class InterpreterError extends Error {}

class DatabaseManager {

    /**
     * The DatabaseManager class is meant to interpret NQL query and return the result.
     * This class does not handle caching the result.
     * The database should take the form of a folder wich contains one CSV file per table.
     * Two more CSV files are required: Tables.csv and Columns.csv. These files contain the meta data of the database.
     * @param {string} folder the path to the folder that contains the database.
     */
    constructor(folder) {
        this._folder = folder;
        this._meta = {};
        this._init = false;
    }

    /**
     * Inits the database manager.
     */
    async init() {
        if (this._init) {
            return;
        }

        this._csv_parser = new CSVParser();
        this._nql_parser = new NQLParser();
        this._meta = await this._load_meta();
        this._tables;
        this._init = true;
    }

    /**
     * This method interprets the given NQL query and returns the asked data taken from the database.
     * @param {string} query the NQL query to interpret.
     * @returns {Promise<*[]>} the result of the query.
     * @throws {InterpreterError} if the query is not valid.
     * @throws {UnexpectedTokenError} if the query is not valid.
     */
    async get(query) {
        await this.init();

        const AST = this._nql_parser.parse(query);

        this._tables = [AST.FROM];

        for (let node of AST.SELECT.ids) {
            this._qualify_table(node);
        }
        const mapper = this._make_mapper(AST.SELECT);

        let limit;

        if (AST.SELECT.limit !== null) {
            let counter = 0;
            limit = () => {
                counter++;
                return counter <= AST.SELECT.limit;
            };
        } else {
            limit = () => true;
        }

        const condition = this._interprate_where(AST.WHERE);

        try {
            const data = await this._csv_parser.parse(path.join(this._folder, AST.FROM + ".csv"), AST.FROM + ".");
            return data.filter(elem => condition(elem) && limit()).map(mapper);
        } catch (e) {
            throw new InterpreterError(`Table ${AST.FROM} does not exist`);
        }
    }

    /**
     * This method load the meta data of the database from the files Tables.csv and Columns.csv.
     * @returns {object} the meta data of the database.
     */
    async _load_meta() {
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

    /**
     * This methods joins two data sets according to the given join condition.
     * @param {*[]} dataSet1 the first data set to join.
     * @param {*[]} dataSet2 the second data set to join.
     * @param {function(*,*):boolean} test the join condition.
     *  The two parameters are the elements of the two data sets.
     *  If the function return true, the elements are merged and added to the result.
     * @returns {*[]} the result of the join.
     */
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

    /**
     * This method create a function that maps the given data to the restricted data set of what has been selected.
     * @param {*} SELECT the SELECT part of the AST
     * @returns {function(object):*} the mapper function.
     */
    _make_mapper(SELECT) {
        const name_map = {};
        const mapper = {};
        for (let node of SELECT.ids) {
            if (node.table == null) {
                name_map[node.qualifyied] = node.column;
            } else {
                name_map[node.qualifyied] = node.qualifyied;
            }
            mapper[node.qualifyied] = DatabaseManager.MAPPERS[this._get_column_type(node)];
        }
        return element => {
            let new_elem = {};

            for (let key in name_map) {
                new_elem[name_map[key]] = mapper[key](element[key]);
            }

            return new_elem;
        };
    }

    /**
     * This function alterate the given identifier node to add two new fields to it.
     * The  `qualifyied` field contains the qualifyed name of the identifier (table.column).
     * The `_table` field will always contains the name of the table. The `table` field will remains unchanged and might be null.
     * @param {*} node the identifier node to qualify.
     * @throws {InterpreterError} if the column is not part of the table or if the specifyed table is not selected.
     */
    _qualify_table(node) {
        if (node.table == null) {
            let tables = this._tables.filter(table => this._meta[table][node.column] != null);
            if (tables.length == 0) {
                throw new InterpreterError(`The column ${node.column} is not defined in the tables ${self._tables.join(", ")}`);
            } else if (tables.length > 1) {
                throw new InterpreterError(`The column ${node.column} is ambiguous in the tables ${self._tables.join(", ")}`);
            } else {
                node._table = tables[0];
            }
        } else if (this._tables.indexOf(node.table) == -1) {
            throw new InterpreterError(`The table ${node.table} is not defined in the query`);
        } else {
            node._table = node.table;
        }

        // TODO : check which is faster with a string or a concatenation.
        node.qualifyied = `${node._table}.${node.column}`;

    }

    /**
     * Helper function that gather the type of a column from the meta data.
     * @param {*} node a qualifyed identifier node.
     * @returns the type of the given node.
     */
    _get_column_type(node) {
        return this._meta[node._table][node.column];
    }

    /**
     * Helper function that interprete on side of an operator expression.
     * @param {*} side an AST node representing a side of an operator expression.
     * @returns {function(object):*} a function that interprets the given side of
     *  an operator expression and transform it into a comparable form.
     */
    _interprate_side(side) {
        if (side.type == NQLParser.TYPES.IDENTIFIER) {
            this._qualify_table(side);
            let type = this._get_column_type(side);
            return data => DatabaseManager.MAPPERS[type](data[side.qualifyied]);
        } else {
            return () => side.value;
        }
    }

    /**
     * Helper function that check if the two nodes have compatible types. This function doesn't check if the nodes are of the same nature.
     * @param {*} node1 the first node.
     * @param {*} node2 the second node.
     * @throws {InterpreterError} if the two nodes have incompatible types.
     */
    _check_types(node1, node2) {
        let type1, type2, value1, value2;
        if (node1.type == NQLParser.TYPES.IDENTIFIER) {
            this._qualify_table(node1);
            type1 = this._get_column_type(node1);
            value1 = node1.qualifyied;
        } else {
            type1 = node1.type;
            value1 = node1.value;
        }
        if (node2.type == NQLParser.TYPES.IDENTIFIER) {
            this._qualify_table(node2);
            type2 = this._get_column_type(node2);
            value2 = node2.qualifyied;
        } else {
            type2 = node2.type;
            value2 = node2.value;
        }
        if (type1 != type2) {
            throw new InterpreterError(
                `Could not compare types ${type1} and ${type2} for ${value1} and ${value2}`
            );
        }
    }

    /**
     * Recursive function that interprete the WHERE clause of the AST and return a predicate that can be used to filter the data.
     * @param {*} node the AST node to interprete.
     * @returns {function(object):boolean} a predicate that can be used to filter the data.
     */
    _interprate_where(node) {
        if (node == null) {
            return () => true;
        }

        if (node.type == NQLParser.TYPES.PARENTHESIS) {
            return this._interprate_where(node.value);
        }

        if (node.type == NQLParser.TYPES.BINARY_EXPRESSION) {
            const left = this._interprate_where(node.left);
            const right = this._interprate_where(node.right);
            switch (node.operator) {
            case "AND":
                return data => left(data) && right(data);
            case "OR":
                return data => left(data) || right(data);
            }
        }

        if (node.type == NQLParser.TYPES.OPERATOR_EXPRESSION) {
            this._check_types(node.left, node.right);

            if (node.left.type == node.right.type) {
                throw new InterpreterError("Illegal statement in WHERE clause, could not compare two values of the same nature");
            } else if (node.left.type != NQLParser.TYPES.IDENTIFIER && node.right.type != NQLParser.TYPES.IDENTIFIER) {
                throw new InterpreterError("Illegal statement in WHERE clause, could not compare two values of the same nature");
            }

            const left = this._interprate_side(node.left);
            const right = this._interprate_side(node.right);
            switch (node.operator) {
            case "=":
                return data => left(data) == right(data);
            case "!=":
                return data => left(data) != right(data);
            case "<":
                return data => left(data) < right(data);
            case "<=":
                return data => left(data) <= right(data);
            case ">":
                return data => left(data) > right(data);
            case ">=":
                return data => left(data) >= right(data);
            }
        }
        throw new InterpreterError(`Unexpected node : ${JSON.stringify(node)}`);
    }

}

DatabaseManager.MAPPERS = {
    "date"  : val => new Date(val),
    "string": val => val,
    "float" : val => parseFloat(val),
    "int"   : val => parseInt(val)
};

// TODO :
// - Add support for joins
// - support IN, LIKE, NOT
// - Parse floats and ints + check if when recieved they are already parsed

module.exports = {DatabaseManager, InterpreterError};