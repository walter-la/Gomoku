export type Player = 0 | 1 | 2; // 0=空, 1=黑, 2=白

export default class GomokuBoard {
  size: number;
  board: number[][];
  movesCount: number;

  constructor(size: number = 15) {
    this.size = size;
    this.board = Array.from({ length: size }, () => Array(size).fill(0));
    this.movesCount = 0;
  }

  placeStone(row: number, col: number, player: Player): boolean {
    if (row < 0 || col < 0 || row >= this.size || col >= this.size) return false;
    if (this.board[row][col] !== 0) return false;
    this.board[row][col] = player;
    this.movesCount++;
    return true;
  }

  checkWin(row: number, col: number, player: Player): boolean {
    if (player === 0) return false;
    const directions = [
      { dr: 0, dc: 1 },
      { dr: 1, dc: 0 },
      { dr: 1, dc: 1 },
      { dr: 1, dc: -1 }
    ];

    for (const { dr, dc } of directions) {
      let count = 1;
      let r = row + dr, c = col + dc;
      while (r >= 0 && c >= 0 && r < this.size && c < this.size && this.board[r][c] === player) {
        count++;
        r += dr;
        c += dc;
      }
      r = row - dr;
      c = col - dc;
      while (r >= 0 && c >= 0 && r < this.size && c < this.size && this.board[r][c] === player) {
        count++;
        r -= dr;
        c -= dc;
      }
      if (count >= 5) return true;
    }
    return false;
  }

  reset() {
    this.board = Array.from({ length: this.size }, () => Array(this.size).fill(0));
    this.movesCount = 0;
  }
}
