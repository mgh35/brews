import React from 'react';
import {AmplifySignOut } from '@aws-amplify/ui-react';

import classes from './Banner.css';


function Banner() {
  return (
    <div className="Banner">
        BREWS
        <AmplifySignOut />
    </div>
  );
}

export default Banner;
