import Product from "./Product";

type Geolocation = {
  _lat: number;
  _long: number;
}

class Farm {
  id: string;
  name: string;
  geolocation: Geolocation;
  available_products: string[];
  detailed_products: Product[];

  constructor(id: string, name: string, geolocation: Geolocation, available_products: string[], detailed_products: Product[] = []) {
    this.id = id;
    this.name = name;
    this.geolocation = geolocation;
    this.available_products = available_products;
    this.detailed_products = detailed_products;
  };
};

export default Farm;