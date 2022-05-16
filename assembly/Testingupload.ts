import { System, SafeMath, chain } from "koinos-sdk-as";
import { testingupload } from "./proto/testingupload";


// spaces
const StateSpaceId = 1;

export class State {
  contractId: Uint8Array;
  stateSpace: chain.object_space;
  constructor(contractId: Uint8Array) {
    this.contractId = contractId;
    this.stateSpace = new chain.object_space(false, contractId, StateSpaceId);
  }
  getState(pool_id: string): testingupload.state {
    const StateCurrent = System.getObject<string, testingupload.state>(this.stateSpace, pool_id, testingupload.state.decode);
    if (StateCurrent) {
      return StateCurrent;
    }
    return new testingupload.state();
  }
  saveState(id: string, StateCurrent: testingupload.state): void {
    System.putObject(this.stateSpace, id, StateCurrent, testingupload.state.encode);
  }
  removeState(id: string): void {
    System.removeObject(this.stateSpace, id);
  }
}



export class Testingupload {
  _contractId: Uint8Array;
  _state: State;

  constructor() {
    this._contractId = System.getContractId();
    this._state = new State(this._contractId);
  }
  current(args: testingupload.current_arguments): testingupload.current_result {
    let res = new testingupload.current_result();
    // process
    let c_state = this._state.getState("current");
    res.num_a = c_state.num_a;
    res.num_b = c_state.num_b;
    res.total = c_state.total;
    return res;
  }

  update(args: testingupload.update_arguments): testingupload.update_result {
    let res = new testingupload.update_result()
    // data
    let num_a = args.num_a;
    let num_b = args.num_b;
    let total = args.total;
    // process
    let c_state = this._state.getState("current");
    c_state.num_a = SafeMath.add(c_state.num_a, num_a);
    c_state.num_b = SafeMath.add(c_state.num_b, num_b);
    c_state.total = SafeMath.add(c_state.total, total);
    this._state.saveState("current", c_state);
    // result
    res.result = true;
    return res;
  }

  
}
