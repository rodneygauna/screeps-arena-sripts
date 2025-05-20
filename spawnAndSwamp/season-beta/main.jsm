import { getObjectsByPrototype, findClosestByRange } from '/game/utils';
import { ATTACK, MOVE, CARRY, RESOURCE_ENERGY } from '/game/constants';
import { StructureSpawn, StructureContainer } from '/game/prototypes';

// Gloabl variables
let attackers;
let haulers = [];

// Game Loop
export function loop() {
  // Variable - My Spawn
  const mySpawn = getObjectsByPrototype(StructureSpawn).find(i => i.my);
  // Variable - Enemy Spawn
  const enemySpawn = getObjectsByPrototype(StructureSpawn).find(i => !i.my);

  // Spawn 2 haulers to gather RESOURCE_ENERGY
  if (haulers.length < 2) {
    let hauler = mySpawn.spawnCreep([MOVE, CARRY]).object;
    if (hauler) {
      haulers.push(hauler)
    }
  } else if (!attacker) {
    attacker = mySpawn.spawnCreep([MOVE, ATTACK]).object;
  }

  // Variable - StructureContainer
  let validContainers = getObjectsByPrototype(StructureContainer).filter(container => container.store[RESOURCE_ENERGY]);

  // Loop for haulers to gather and store RESOURCE_ENERGY
  for (let hauler of haulers) {
    if (hauler.store[RESOURCE_ENERGY]) {
      hauler.moveTo(mySpawn)
      hauler.transfer(mySpawn, RESOURCE_ENERGY)
    } else {
      let container = findClosestByRange(hauler, validContainers)
      hauler.moveTo(container)
      haouler.withdraw(container, RESOURCE_ENERGY)
    }
  }

  // Attackers move to Enemy Spawn and Attack
  if (attacker) {
    attacker.moveTo(enemySpawn)
    attacker.attack(enemySpawn)
  }

}
