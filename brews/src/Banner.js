import React from 'react';
import {AmplifySignOut } from '@aws-amplify/ui-react';

import styles from './Banner.module.css';


function Banner() {
  return (
    <div className={styles.banner}>
        BREWS
        <AmplifySignOut />
    </div>
  );
}

export default Banner;
