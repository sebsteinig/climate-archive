'use client'
import Dexie, { Table } from 'dexie';
import {Texture, TextureInfo} from './Texture';


export class Database extends Dexie {

  textures!: Table<Texture,string>; 
  textures_info !: Table<TextureInfo,[string,string]>; 

  constructor() {
    super('ClimateArchiveDB');
    
    this.version(5).stores({
        textures: 'path',
        textures_info: '[exp_id+variable]'
    });
    this.textures.mapToClass (Texture);
    this.textures_info.mapToClass (TextureInfo);
  }
}