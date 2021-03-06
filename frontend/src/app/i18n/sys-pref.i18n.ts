import { SysPreference } from 'picsur-shared/dist/dto/sys-preferences.enum';

export const SysPreferenceFriendlyNames: {
  [key in SysPreference]: string;
} = {
  [SysPreference.JwtSecret]: 'JWT Secret',
  [SysPreference.JwtExpiresIn]: 'JWT Expiry Time',
  [SysPreference.BCryptStrength]: 'BCrypt Strength',

  [SysPreference.RemoveDerivativesAfter]: 'Cached Images Expiry Time',
  [SysPreference.SaveDerivatives]: 'Cache Trancoded Images',
  [SysPreference.AllowEditing]: 'Allow images to be edited (e.g. resize)',

  [SysPreference.ConversionTimeLimit]: 'Transcode/Edit Time Limit',
  [SysPreference.ConversionMemoryLimit]: 'Transcode/Edit Memory Limit MB',
};
