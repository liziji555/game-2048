// storage.js — localStorage 数据层封装。
// 现在只管最高分 + 背包 + 技能冷却，后面 roguelike 词条的持久化都走这里，
// 业务代码不直接碰 localStorage。

const KEY = 'game2048.state.v1';

const defaults = {
  best: 0,
  backpack: [],   // 肉鸽词条背包：[{id, name, rarity, ...}]
  cooldowns: {},  // 技能冷却：{skillId: availableAtMs}
};

function load() {
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) || '{}') };
  } catch {
    return { ...defaults };
  }
}

let state = load();

function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function getBest() { return state.best; }

export function setBest(score) {
  if (score > state.best) {
    state.best = score;
    save();
  }
}

export function addItem(item) {
  state.backpack.push(item);
  save();
}

export function listItems() { return [...state.backpack]; }

export function setCooldown(skillId, ms) {
  state.cooldowns[skillId] = Date.now() + ms;
  save();
}

export function cooldownLeft(skillId) {
  return Math.max(0, (state.cooldowns[skillId] || 0) - Date.now());
}
