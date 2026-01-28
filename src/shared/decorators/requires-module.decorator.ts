import { SetMetadata } from '@nestjs/common';

export const MODULE_KEY = 'required_module';
export const RequiresModule = (moduleSlug: string) => SetMetadata(MODULE_KEY, moduleSlug);
