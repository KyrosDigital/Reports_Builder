import React, from 'react'
import { Switch } from '@headlessui/react'

export const ToggleSwitch = ({enabled, setEnabled}) => {
	console.log(enabled)
  return (
    <Switch.Group>
      <div className="flex items-center">
				
        <Switch
          checked={enabled}
          onChange={setEnabled}
          className={`${
            enabled ? 'bg-green-400' : 'bg-gray-200'
          } relative inline-flex items-center h-6 rounded-full w-11 transition-colors ease-in-out duration-200 focus:outline-none`}
        >
          <span
            className={`${
              enabled ? 'translate-x-6' : 'translate-x-1'
            } inline-block w-4 h-4 transform bg-white rounded-full transition ease-in-out duration-200`}
          />
        </Switch>
				{enabled && <Switch.Label className="ml-4">Private Report</Switch.Label>}
        {!enabled && <Switch.Label className="ml-4">Public Report</Switch.Label>}
      </div>
    </Switch.Group>
  )
}
