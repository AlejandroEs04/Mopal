import pool from "../config/DB.js";
import getType from "../helpers/getType.js";

class ActiveRecord {
    static tableName = ''

    async getAll() {

        const query = `SELECT * FROM ${this.tableName}`;
        try {
            const [results, fields] = await pool.execute(query);
            return results;
        } catch (error) {
            console.log(error);
            return;
        }
    }

    /** NEW METHOD */
    async getAllItems() {
        const query = `SELECT * FROM ${this.tableName}`;

        try {
            const [results, fields] = await pool.execute(query);
            return results;
        } catch (error) {
            throw new Error('Hubo un error')
        }
    }

    async getAllTable(name) {
        const query = `SELECT * FROM ${name}`;
        try {
            const [results, fields] = await pool.execute(query);
            return results;
        } catch (error) {
            console.log(error);
            return;
        }
    }

    async getByID(id) {
        const query = `SELECT * FROM ${this.tableName} WHERE ID = ?`;
        try {
            const [results, fields] = await pool.execute(query, [id]);
            return results[0];
        } catch (error) {
            console.log(error);
            return;
        }
    }

    async getByFolio(folio) {
        const query = `SELECT * FROM ${this.tableName} WHERE Folio = ?`;
        try {
            const [results, fields] = await pool.execute(query, [folio]);
            return results[0];
        } catch (error) {
            console.log(error);
            return;
        }
    }

    /** NEW METHOD */
    async getItemById(id) {
        const query = `SELECT * FROM ${this.tableName} WHERE id = ?`

        try {
            const [results, fields] = await pool.execute(query, [id])
            return results[0]
        } catch (error) {
            throw new Error('Hubo un error')
        }
    }

    async getByElement(element, value) {
        const query = `SELECT * FROM ${this.tableName} WHERE ${element} = ?`;

        try {
            const [results, fields] = await pool.execute(query, [value]);
            return results[0];
        } catch (error) {
            console.log(error);
            return;
        }
    }
    
    async getByElementTable(name, element, value) {
        const query = `SELECT * FROM ${name} WHERE ${element} = ?`;

        try {
            const [results, fields] = await pool.execute(query, [value]);
            return results[0];
        } catch (error) {
            console.log(error);
            return;
        }
    }
    
    async getByElementTableArray(name, element, value) {
        const query = `SELECT * FROM ${name} WHERE ${element} = ?`;

        try {
            const [results, fields] = await pool.execute(query, [value]);
            return results;
        } catch (error) {
            console.log(error);
            return;
        }
    }

    async getByElementArray(element, value) {
        const query = `SELECT * FROM ${this.tableName} WHERE ${element} = ?`;
        try {
            const [results, fields] = await pool.execute(query, [value]);
            return results;
        } catch (error) {
            console.log(error);
            return;
        }
    }

    async addOne(object) {
        const { tableName, ID, id, ...item } = object;
        const claves = Object.keys(item);
        const values = Object.values(item);

        let query = `INSERT INTO ${tableName} (${claves.join(', ')}) VALUES (${claves.map(() => '?').join(', ')})`;

        try {
            const response = await pool.execute(query, values);
            return { msg: `${tableName} Creado Correctamente`, response };
        } catch (error) {
            return;
        }
    }

    /** NEW METHOD */
    async addItem(object) {
        const { tableName, id, ...item } = object;
        const claves = Object.keys(item);
        const values = Object.values(item);

        let query = `INSERT INTO ${tableName} (${claves.join(', ')}) VALUES (${claves.map(() => '?').join(', ')})`;

        try {
            await pool.execute(query, values);
        } catch (error) {
            console.log(error)
            throw new Error('Hubo un error')
        }
    }

    async addOneWithoutFolio(object) {
        const { tableName, ID, Folio, ...item } = object;
        const claves = Object.keys(item);
        const values = Object.values(item);

        let query = `INSERT INTO ${tableName} (${claves.join(', ')}) VALUES (${claves.map(() => '?').join(', ')})`;

        try {
            const response = await pool.execute(query, values);
            return { msg: `${tableName} Creado Correctamente`, response };
        } catch (error) {
            console.log(error);
            return;
        }
    }

    async addMany(array) {
        const { tableName, ...item } = this
        const claves = Object.keys(item)
        let query = `INSERT INTO ${tableName} (`;
        query += `${claves.map(clave => clave)}`
        query += `) VALUES `
        let i = 0;

        array?.map(product => {
            query += `${i === 0 ? '' : ','} (${claves.map(clave => getType(product[clave]))})`
            i++;
        })

        try {
            const response = await pool.query(query);
            return { msg: `${tableName} Creado Correctamente`, response };
        } catch (error) {
            console.log(error);
            return;
        }
    }

    async updateOne(object) {
        const { tableName, ID, Folio, ...item } = object;
        const claves = Object.keys(item);
        const values = Object.values(item);

        let query = `UPDATE ${tableName} SET ${claves.map(clave => `${clave} = ?`).join(', ')} WHERE ${ID ? 'ID' : 'Folio'} = ?`;

        try {
            await pool.execute(query, [...values, ID || Folio]);
            return { msg: `${tableName} Actualizado Correctamente` };
        } catch (error) {
            console.log(error);
            return;
        }
    }

    /** NEW METHOD */
    async updateItem(object) {
        const { tableName, id, ...item } = object;
        const claves = Object.keys(item);
        const values = Object.values(item);

        let query = `UPDATE ${this.tableName} SET ${claves.map(clave => `${clave} = ?`).join(', ')} WHERE id = ?`;

        try {
            await pool.execute(query, [...values, id]);
        } catch (error) {
            console.log(error)
            throw new Error('Hubo un error')
        }
    }

    async updateOneColumn(id, columnName, value) {
        const query = `UPDATE ${this.tableName} SET ${columnName} = ? WHERE ${typeof id === 'string' ? 'Folio' : 'ID'} = ?`;

        try {
            await pool.execute(query, [value, id]);
            return { msg: `${this.tableName} Actualizado Correctamente` };
        } catch (error) {
            console.log(error);
            return;
        }
    }

    async toggleActiveOne(id, active) {
        const query = `UPDATE ${this.tableName} SET Active = ? WHERE ID = ?`;

        try {
            await pool.execute(query, [active, id]);
            return { msg: `${this.tableName} Desactivado Correctamente` };
        } catch (error) {
            console.log(error);
            return;
        }
    }

    async deleteOneId(id) {
        const query = `DELETE FROM ${this.tableName} WHERE ID = ?`;

        try {
            await pool.execute(query, [id]);
            return { msg: `${this.tableName} Eliminado Correctamente` };
        } catch (error) {
            console.log(error);
            return;
        }
    }

    /** NEW METHOD */
    async deleteById(id) {
        const query = `DELETE FROM ${this.tableName} WHERE id = ?`

        try {
            await pool.execute(query, [id])
        } catch (error) {
            console.log(error)
            throw new Error('Hubo un error')
        }
    }

    /** NEW METHOD */
    async deleteByElement(element, value) {
        const query = `DELETE FROM ${this.tableName} WHERE ${element} = ?`

        try {
            await pool.execute(query, [value])
        } catch (error) {
            console.log(error)
            throw new Error('Hubo un error')
        }
    }

    async exectQuery(query) {
        try {
            await pool.execute(query)
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async exectQueryInfo(query) {
        try {
            const [results, fields] = await pool.execute(query)
            return results
        } catch (error) {
            console.log(error)
            return false
        }
    }
}

export default ActiveRecord;
