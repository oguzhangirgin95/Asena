export const LoginConfig = {
  config: {
    steps: [
      {
        step: 'start',
        showContinueButton: false,
        showBackButton: false,
        validation: [
          {
            id: 'username',
            validatorType: 'ValidatorEnum.Required',
            validationMessage: 'VALIDATION_REQUIRED | Username is required'
          },
          {
            id: 'password',
            validatorType: 'ValidatorEnum.Required',
            validationMessage: 'VALIDATION_REQUIRED | Password is required'
          }
        ],
      },
    ],
  }
};
