// by: Leo Pawel 	<https://github.com/galaxy126>
// at 28/6/2022

import 'mocha';
import { personalSign } from '../library/wallet';

describe('method signature',  () => { 
    const sign = personalSign("19fe61d137237c57bf9bb8473b9a0d51d2712fad82f297317717e263e450eb77", "0x4578616d706c652060706572736f6e616c5f7369676e60206d657373616765")
    return sign
})
