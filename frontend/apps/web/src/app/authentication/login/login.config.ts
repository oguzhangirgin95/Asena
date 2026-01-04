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
            validationMessage: 'Username is required'
          },
          {
            id: 'password',
            validatorType: 'ValidatorEnum.Required',
            validationMessage: 'Password is required'
          }
        ],
      },
    ],
  }
};
