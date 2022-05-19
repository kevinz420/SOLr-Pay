export interface DisplayType {
    "id": string,
    "name" : string,
    "price" : number,
    "distance" : number,
    "storageDays" : number,
    "freshnessRating" : "fresh" | "expiring",
    "image" : string
}