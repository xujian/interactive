import { ConfirmConfig, MakeInteractiveContentProps } from 'index';
import { Button } from './ui/button';

export interface ConfirmContentProps {
  message: string;
  config: ConfirmConfig;
}

export const ConfirmContent = ({
  message,
  config,
  onComplete,
  onAbort,
}: MakeInteractiveContentProps<ConfirmContentProps>) => {
  return (
    <div className='confirm-content flex flex-col items-center justify-center'>
      <div className='message w-full text-start mb-4'>{message}</div>
      <div className='w-full flex flex-row items-center justify-end gap-4'>
        <Button variant="outline" onClick={onAbort}>{config?.cancelText || 'Cancel'}</Button>
        <Button variant={config?.danger ? 'destructive' : 'default'} onClick={onComplete}>{config?.okText || 'Confirm'}</Button>
      </div>
    </div>
  );
};
