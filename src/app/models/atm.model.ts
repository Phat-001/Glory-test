
export interface IAtm {
    id: string;
    atm_name: string;
    manufacturer: string;
    type: string;
    serial_number: number;
    image?: string;
}

export interface IAtmForm extends IAtm {
    isViewMode?: boolean;
}