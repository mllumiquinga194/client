export class User {
    //esta es la forma de hacerlo en Typescript 2015
    constructor(
        public _id: string,
        public name: string,
        public surname: string,
        public email: string,
        public password: string,
        public rol: string,
        public image: string
    ){}
}