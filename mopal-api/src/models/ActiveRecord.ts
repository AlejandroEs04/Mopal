import { RowDataPacket } from "mysql2"
import pool from "../config/db"

export abstract class ActiveRecord<T> {
    tableName: string

    async getAll(): Promise<T[]> {
        const query = `SELECT * FROM ${this.tableName}`

        try {
            const [ rows ] = await pool.execute(query)
            return rows as T[]
        } catch (error) {
            console.error(error)
            throw new Error('Error fetching all records')
        }
    }

    async getById(id: number | string): Promise<T> {
        const query = `SELECT * FROM ${this.tableName} WHERE id = ?`

        try {
            const [rows] = await pool.execute(query, [id])
            return rows[0] as T
        } catch (error) {
            console.log(error)
            throw new Error('Error fetching the record')
        }
    }

    async getByElement(element: string, value: string | number): Promise<T[]> {
        const query = `SELECT * FROM ${this.tableName} WHERE ? = ?`

        try {
            const [ rows ] = await pool.execute(query, [element, value])
            return rows as T[]
        } catch (error) {
            console.log(error)
            throw new Error('Error fetching all records')
        }
    }

    async create(item: Omit<T, 'id'>, EXCLUDED_PROPS = ['tableName', 'id']): Promise<void> {
        const keys = Object.keys(item).filter(key => !EXCLUDED_PROPS.includes(key))
        const values = keys.map(key => (item as any)[key])
        const query = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`

        try {
            await pool.execute(query, values)
        } catch (error) {
            console.error(error)
            throw new Error('Error creating record')
        }
    }

    async update(id: number | string, item: Partial<T>, EXCLUDED_PROPS = ['tableName', 'id']): Promise<void> {
        const keys = Object.keys(item).filter(key => !EXCLUDED_PROPS.includes(key))
        const values = keys.map(key => (item as any)[key])
        const query = `UPDATE ${this.tableName} SET ${keys.map(k => `${k} = ?`).join(', ')} WHERE id = ?`;

        try {
            await pool.execute(query, [...values, id]);
        } catch (error) {
            console.error(error);
            throw new Error('Error updating record');
        }
    }

    async deleteById(id: number | string) : Promise<void> {
        const query = `DELETE FROM ${this.tableName} WHERE id = ?`

        try {
            await pool.execute(query, [id])
        } catch (error) {
            console.error(error);
            throw new Error('Error updating record');
        }
    }
}