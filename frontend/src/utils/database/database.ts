'use client'
import Dexie, { Table } from 'dexie';
import Texture from './Texture';


export class Database extends Dexie {

  textures!: Table<Texture,string>; 

  constructor() {
    super('ClimateArchiveDB');
    
    this.version(1).stores({
        textures: 'path,exp_id,variable,chunk_time,chunk_vertical,resolution'
    });
    this.textures.mapToClass (Texture);
  }
}


export const database = new Database()