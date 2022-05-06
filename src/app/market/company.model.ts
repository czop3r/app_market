export class Company {
    constructor(
        public symbol: string,
        public price: string,
        public volume: string,
        public change: string,
        public changePercent: string
    ) {}

}

export class CompanyChart {
    constructor(
        public x: Array<string>,
        public y: Array<string>,
        public label: string
    ) {}
}