export class Album {
    //esta es la forma de hacerlo en Typescript 2015
    constructor(
        public title: string,
        public description: string,
        public year: number,
        public image: string,
        public artist: string
    ){}
}