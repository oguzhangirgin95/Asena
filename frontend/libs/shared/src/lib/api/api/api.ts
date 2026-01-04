export * from './auth-controller.service';
import { AuthControllerService } from './auth-controller.service';
export * from './money-transfer-controller.service';
import { MoneyTransferControllerService } from './money-transfer-controller.service';
export * from './resource-controller.service';
import { ResourceControllerService } from './resource-controller.service';
export const APIS = [AuthControllerService, MoneyTransferControllerService, ResourceControllerService];
