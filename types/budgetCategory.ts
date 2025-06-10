import { Transaction } from "./transaction";

export interface CategoryDTO {
  categoryId: number;
  name: string;
  type: string;
  transactions: Transaction[];
}
