import { Business } from "./Business";
import { Portal } from "./Portal";

export interface JobiBox {
    id: any;
    business: Business;
    portals: Portal[];
    videotheque: boolean;
    training: any;
    exam: any;
    country: string;
    version: string;
}