import { Api as BaseApi } from '../base/api';
import {
	IItemProductStructure as Product,
	IFormOrderStructure as OrderForm,
	IOrderTransactionResult as OrderResult,
	ITotalElementsList as TotalItems,
	IVendorAPIInterface as ProductApiInterface,
} from '../../types/index';

export class ProductApiService extends BaseApi implements ProductApiInterface {
	readonly cdn: string;


	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		if (!cdn || !baseUrl) {
			throw new Error(
				'CDN и базовый URL необходимы для работы ProductApiService.'
			);
		}
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductList(): Promise<Product[]> {
		return this.get('/product').then((response) => {
			const data = response as TotalItems<Product>;
			return data.items.map((product: Product) => ({
				...product,
				image: `${this.cdn}${product.image}`,
			}));
		});
	}

	getProductItem(id: string): Promise<Product> {
		return this.get(`/product/${id}`).then((productData) => {
			const product = productData as Product; 
			return {
				...product,
				image: `${this.cdn}${product.image}`, 
			};
		});
	}

	orderProduct(order: OrderForm): Promise<OrderResult> {
		return this.post('/order', order).then((response) => {
			const result = response as OrderResult; 
			return result;
		});
	}
}
