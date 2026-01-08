import { FlowConfig, State, MoneyTransferControllerService } from '@frontend/shared';

export const MoneyTransferConfig: FlowConfig = {
  config: {
    steps: [
      {
        step: 'start',
        showContinueButton: true,
        showBackButton: true,
        validation: [],
      },
      {
        step: 'contact',
        showContinueButton: true,
        showBackButton: true,
        validation: [],
      },
      {
        step: 'confirm',
        showContinueButton: true,
        showBackButton: true,
        validation: [],
        service:{
          serviceName: MoneyTransferControllerService.name,
          methodName: "confirm",
          params:[State.transferRequest]
        }
      },
      {
        step: 'execute',
        showContinueButton: false,
        showBackButton: false,
        validation: [],
        service:{
          serviceName: MoneyTransferControllerService.name,
          methodName: "execute",
          params:[State.transferRequest]
        },
        keepState: false,
        buttons: [
          {
            id:"button1",
            label: 'AllAccounts | Account',
            navigate: 'all-account',
            color: 'primary',
            isVisible: "State.transferRequest?.fromAccountType === 'ACCOUNT'",
          },
          {
            id:"button2",
            label: 'AccountDetail | Account Detail',
            navigate: 'account-detail',
            color: 'primary',
            isVisible: "State.transferRequest?.fromAccountType === 'ACCOUNT'",
          },
        ],
      },
    ],
  }
};
