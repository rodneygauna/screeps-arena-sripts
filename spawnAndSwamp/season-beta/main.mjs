import { getObjectsByPrototype, findClosestByRange, getRange } from '/game/utils';
import { ATTACK, MOVE, CARRY, RESOURCE_ENERGY } from '/game/constants';
import { StructureSpawn, StructureContainer, Creep } from '/game/prototypes';

// Gloabl variables
let attackers = [];
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
  }
  else {
    let attacker = mySpawn.spawnCreep([MOVE, ATTACK]).object;
    if (attacker) {
      attackers.push(attacker)
    }
  }

  // Variable - StructureContainer
  let validContainers = getObjectsByPrototype(StructureContainer).filter(container => container.store[RESOURCE_ENERGY] && Math.abs(container.y -50) <20)

  // Loop for haulers to gather and store RESOURCE_ENERGY
  for (let hauler of haulers) {
    if (!hauler.store) continue
    if (hauler.store[RESOURCE_ENERGY]) {
      if (getRange(hauler, mySpawn) > 1) {
        hauler.moveTo(mySpawn)
      }
      else {
        hauler.transfer(mySpawn, RESOURCE_ENERGY)
        let container = findClosestByRange(hauler, validContainers)
        hauler.moveTo(container)
      }
    }
    else {
      let container = findClosestByRange(hauler, validContainers)
      if (getRange(hauler, container) > 1) {
        hauler.moveTo(container)
      }
      else {
        hauler.withdraw(container, RESOURCE_ENERGY)
        hauler.moveTo(mySpawn)
      }
    }
  }

  // Variable - Enemy Creeps
  let enemyCreeps = getObjectsByPrototype(Creep).filter(c => !c.my)
  // Attackers move to Enemy Spawn and Attack
  for (let attacker of attackers) {
    attacker.moveTo(enemySpawn)
    if (getRange(attacker, enemySpawn) <= 1) {
      attacker.attack(enemySpawn);
    }
    else {
      for (let enemyCreep of enemyCreeps) {
        if (getRange(attacker, enemyCreep) <= 1) {
          attacker.attack(enemyCreep)
          break
        }
      }
    }
  }

}
