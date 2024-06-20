import type { IndexDBDatabaseCreationData } from "./Types/Database.types.js";
import { IndexDBCore } from "./Core/IndexDBCore.js";

export class IndexDB {
  private static __initalized = false;
  static core = IndexDBCore;

  static async init() {
    if (this.__initalized) return;
    await this.core.initialize();
    this.__initalized = true;
  }

  static async createOrGetDataBase(data: IndexDBDatabaseCreationData) {
    const exists = await this.databaseExists(data.databaseName);
    if (!exists) return await this.createDatabase(data);
    return await this.getDatabase(data.databaseName);
  }

  static async databaseExists(dataBaseName: string) {
    return await this.core.dataBaseExist(dataBaseName);
  }
  static async createDatabase(data: IndexDBDatabaseCreationData) {
    return await this.core.createDataBase(data);
  }
  static async updateDatabase(data: IndexDBDatabaseCreationData) {
    return await this.core.createDataBase(data);
  }
  static async getDatabase(name: string) {
    return await this.core.getDataBase(name);
  }
  static async deleteDatabase(name: string) {
    return await this.core.deleteDataBase(name);
  }
}
