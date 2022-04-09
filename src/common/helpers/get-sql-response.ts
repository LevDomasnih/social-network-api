import { SqlToJsonModel } from '../model/sql-to-json.model';

export class GetSqlResponse<T> {

    /**
     * sql скрипт должен вернуть массив, внутри которого будет объект с полем rows
     *
     * метод возвращает первый элемент массива
     */
    // tslint:disable-next-line:no-any
    getRow(json: SqlToJsonModel<T>[]):  { [p: string]: any } {
        return json?.[0]?.rows[0] ?? {}
    }

    /**
     * sql скрипт должен вернуть массив, внутри которого будет объект с полем rows
     *
     * метод возвращает все элементы массива
     */
    // tslint:disable-next-line:no-any
    getRows(json: SqlToJsonModel<T>[]): T[] {
        return json?.[0]?.rows ?? []
    }
}
