export const LoginConfig = {
  config: {
    steps: [
      {
        step: 'start',
        showContinueButton: false,
        showBackButton: false,
        disableLayout: true,
        validation: [
          {
            id: 'username',
            validatorType: 'ValidatorEnum.Required',
            validationMessage: 'VALIDATION_REQUIRED | Username is required'
          },
          {
            id: 'username',
            validatorType: '',
            customValidation: Validation,
            validationMessage: 'VALIDATION_CUSTOM | Username cannot be "admin"'
          },
          {
            id: 'username',
            validatorType: '',
            customValidation: ValidationLength,
            validationMessage: 'VALIDATION_LENGTH_CUSTOM | Username cannot be higher than 6 characters'
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


export function Validation(value: any) {
  if (value?.trim().toLowerCase() === 'admin') {
    return false;
  }

  return true;
}

export function ValidationLength(value: any) {
  if (value?.length>5) {
    return false;
  }

  return true;
}