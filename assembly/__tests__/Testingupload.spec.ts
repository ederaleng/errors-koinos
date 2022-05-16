import { Base58, MockVM, chain, protocol, StringBytes } from "koinos-sdk-as";
import { Testingupload } from '../Testingupload';
import { testingupload } from '../proto/testingupload';

// contract
const CONTRACT_ID = Base58.decode("17TAwcuJ4tHc9TmCbZ24nSMvY9bPxwQq5s");
// address
const MOCKADRESS = Base58.decode("13nxuEi19W8sfjQiaPLSv2ht2WVp6dNyhn");


describe('contract', () => {
  beforeEach(() => {
    MockVM.reset();
    MockVM.setContractId(CONTRACT_ID);
    // set transaction
    let headInfo = new chain.head_info();
    headInfo.head_block_time = 123456789;
    headInfo.last_irreversible_block = 3;
    MockVM.setHeadInfo(headInfo);
    let _transaction = new protocol.transaction();
    let header = new protocol.transaction_header();
    header.payer = MOCKADRESS;
    _transaction.id = StringBytes.stringToBytes("0x12345");
    _transaction.header = header;
    MockVM.setTransaction(_transaction);

  });
  it("should update state", () => {
    const c = new Testingupload();

    // step 1
    const args1 = new testingupload.update_arguments(1000000000, 8100000000, 2846049894);
    const res1 = c.update(args1);
    expect(res1.result).toStrictEqual(true);

    // step 2
    const args2 = new testingupload.current_arguments();
    const res2 = c.current(args2);
    expect(res2.num_a).toStrictEqual(1000000000);
    expect(res2.num_b).toStrictEqual(8100000000);
    expect(res2.total).toStrictEqual(2846049894);

    // step 3
    const args3 = new testingupload.update_arguments(1000000000, 8100000000, 2846049894);
    const res3 = c.update(args3);
    expect(res3.result).toStrictEqual(true);

    // step 4
    const args4 = new testingupload.current_arguments();
    const res4 = c.current(args4);
    expect(res4.num_a).toStrictEqual(2000000000);
    expect(res4.num_b).toStrictEqual(16200000000);
    expect(res4.total).toStrictEqual(5692099788);

    // If steps 5 and 6 are commented out, the test passes correctly.


    // step 5
    const args5 = new testingupload.update_arguments(1000000000, 8100000000, 2846049894);
    const res5 = c.update(args5);
    expect(res5.result).toStrictEqual(true);

    // step 6
    const args6 = new testingupload.current_arguments();
    const res6 = c.current(args6);
    expect(res6.num_a).toStrictEqual(3000000000);
    expect(res6.num_b).toStrictEqual(24300000000);
    expect(res6.total).toStrictEqual(8538149682);


  });
});
