export class Song {
    //esta es la forma de hacerlo en Typescript 2015
    constructor(
        public number: number,
        public name: string,
        public duration: number,
        public file: string,
        public album: string
    ){}
}