import React from 'react';

const Rank = ( {name, entries} ) => {
    return (
        <div>
            <div className='light-yellow f2 b mb2'>
                {`Hi ${name}`}
            </div>
            <div className='white f3 b'>
                {'Your current entry count is...'}
            </div>
            <div className='white f1'>
                {entries}
            </div>
        </div>
    );
}

export default Rank;