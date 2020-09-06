class Brew {
    timestamp: string;
    comment: string;

    constructor(comment: string) {
        this.timestamp = new Date().toISOString();
        this.comment = comment
    }
}

export default Brew
