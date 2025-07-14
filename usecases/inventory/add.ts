import Farm from '@/domain/entities/Farm';
import Inventory from '@/domain/entities/Inventory';
import Kardex from '@/domain/entities/Kardex';
import Notification from '@/domain/entities/Notification';
import { GoalRepository } from '@/domain/repositories/GoalRepository';
import { InventoryRepository } from '@/domain/repositories/InventoryRepository';
import { KardexRepository } from '@/domain/repositories/KardexRepository';
import { NotificationRepository } from '@/domain/repositories/NotificationRepository';
import { Timestamp } from 'firebase/firestore';

type InventoryParams = {
  farm: Farm;
  items: Inventory['items'];
  state: string;
};

class AddInventoryUseCase {
  constructor(
    private inventoryRepository: InventoryRepository,
    private kardexRepository: KardexRepository,
    private goalRepository: GoalRepository,
    private notificationRepository: NotificationRepository
  ) {}

  async execute(params: InventoryParams): Promise<Inventory> {
    const inventory = new Inventory(
      '',
      params.farm,
      params.items,
      params.state,
      new Date()
    );

    for (const item of inventory.items) {
      const farmId = inventory.farm.id;
      const productId = item.product.id;
      const targetState = inventory.state;
      const amount = item.amount;

      let originState: 'WAITING' | 'IN_PRODUCTION' | null = null;
      if (targetState === 'IN_PRODUCTION') originState = 'WAITING';
      if (targetState === 'READY') originState = 'IN_PRODUCTION';

      if (originState) {
        const originKardex = await this.kardexRepository.getByFarmProductState(farmId, productId, originState);
        console.log('Origin Kardex:', originKardex);
        if (!originKardex || originKardex.amount < amount) {
          throw new Error(`INSUFFICIENT_STOCK:${item.product.name}`);
        }

        await this.kardexRepository.updateAmount(originKardex.id, originKardex.amount - amount);
      }

      const currentKardex = await this.kardexRepository.getByFarmProductState(farmId, productId, targetState);
      if (currentKardex) {
        await this.kardexRepository.updateAmount(currentKardex.id, currentKardex.amount + amount);
      } else {
        const newKardex = new Kardex('', farmId, productId, targetState, amount);
        await this.kardexRepository.create(newKardex);
      }
    }

    if (inventory.state === 'READY') {
      const pendingGoals = await this.goalRepository.findPendingProductionGoals(
        inventory.farm.id,
        new Date()
      );

      for (const goal of pendingGoals) {
        let allItemsMet = true;

        for (const goalItem of goal.items) {
          const totalReady = await this.inventoryRepository.sumAmountSince(
            inventory.farm.id,
            goalItem.product_id,
            'READY',
            goal.created_at as unknown as Timestamp
          );

          console.log(`Total ready for ${goalItem.product_id.id}:`, totalReady);

          if (totalReady < goalItem.amount) {
            allItemsMet = false;
            break;
          }
        }

        if (allItemsMet) {
          console.log(`Marking goal ${goal.id} as finished`);
          await this.goalRepository.markAsFinished(goal.id);

          await this.notificationRepository.create(
            new Notification(
              '',
              'PRODUCTION',
              inventory.farm.name,
              new Date()
            )
          );
        };
      };
    };

    return await this.inventoryRepository.add(inventory);
  }
}

export default AddInventoryUseCase;
