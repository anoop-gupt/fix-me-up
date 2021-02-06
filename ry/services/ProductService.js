import { get } from '../core/api';

export default class ProductService {
  static getProduct = id => get(`https://api.marksandspencer.com/catalog/v2/products/${id}`)
}

// Sample set
// Mul Size & Mul Color: Velvet Gold Button Double Breasted Jacket P60116460,
// Mul Color 0 size:   Quick Dry Nail Colour P22132204
// 1 Color Mul Size: Floral Print Prom Skater Dress P60126717
// 1 Color Mul Size: Lace-up Trainers P60132766
// O col/size: Refreshing After-Sun Lotion for Face & Body 200ml P22312112
