'use client'
import Dexie, { Table } from 'dexie';
import {Collection, Texture, TextureInfo} from './database.types';


export class Database extends Dexie {

  textures!: Table<Texture,string>; 
  textures_info !: Table<TextureInfo,[string,string]>; 
  collections !: Table<Collection, number>

  constructor() {
    super('ClimateArchiveDB');
    
    this.version(6).stores({
        textures: 'path',
        textures_info: '[exp_id+variable]',
        collections:'++id'
    });
    this.textures.mapToClass (Texture);
    this.textures_info.mapToClass (TextureInfo);
    this.collections.mapToClass(Collection);
  }
}