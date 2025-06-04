import Phaser from 'phaser';
import GomokuBoard, { Player } from '../utils/GomokuBoard';

export default class GameScene extends Phaser.Scene {
  private boardSize!: number;
  private cellSize!: number;
  private boardStartX!: number;
  private boardStartY!: number;
  private gomoku!: GomokuBoard;
  private currentPlayer!: Player;
  private graphics!: Phaser.GameObjects.Graphics;
  private isGameOver!: boolean;
  private winnerText?: Phaser.GameObjects.Text;
  private restartText?: Phaser.GameObjects.Text;

  constructor() {
    super('GameScene');
  }

  create() {
    this.boardSize = 15;
    this.gomoku = new GomokuBoard(this.boardSize);
    this.currentPlayer = 1;
    this.isGameOver = false;

    const boardPixelSize = Math.min(this.cameras.main.width, this.cameras.main.height) * 0.9;
    this.cellSize = boardPixelSize / (this.boardSize - 1);
    this.boardStartX = (this.cameras.main.width - boardPixelSize) / 2;
    this.boardStartY = (this.cameras.main.height - boardPixelSize) / 2;

    this.graphics = this.add.graphics();
    this.drawBoard();

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.isGameOver) return;
      const worldX = pointer.x;
      const worldY = pointer.y;
      const relativeX = worldX - this.boardStartX;
      const relativeY = worldY - this.boardStartY;
      if (relativeX < -this.cellSize/2 || relativeY < -this.cellSize/2 ||
          relativeX > boardPixelSize + this.cellSize/2 || relativeY > boardPixelSize + this.cellSize/2) {
        return;
      }
      const col = Math.round(relativeX / this.cellSize);
      const row = Math.round(relativeY / this.cellSize);

      const success = this.gomoku.placeStone(row, col, this.currentPlayer);
      if (!success) return;

      this.drawStone(row, col, this.currentPlayer);

      const won = this.gomoku.checkWin(row, col, this.currentPlayer);
      if (won) {
        this.endGame(this.currentPlayer);
      } else if (this.gomoku.movesCount >= this.boardSize * this.boardSize) {
        this.endGame(0);
      } else {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
      }
    });

    this.winnerText = this.add.text(this.cameras.main.centerX, this.boardStartY - 40, '輪到 黑子 下', {
      font: '20px Arial',
      color: '#000000'
    }).setOrigin(0.5);

    this.restartText = this.add.text(this.cameras.main.centerX, this.boardStartY + boardPixelSize + 20, '重新開始', {
      font: '18px Arial',
      color: '#ff0000',
      backgroundColor: '#ffffff',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setInteractive();
    this.restartText.on('pointerdown', () => {
      this.resetGame();
    });
  }

  private drawBoard() {
    this.graphics.clear();
    this.graphics.fillStyle(0xf5deb3, 1);
    this.graphics.fillRect(
      this.boardStartX - this.cellSize / 2,
      this.boardStartY - this.cellSize / 2,
      this.cellSize * (this.boardSize - 1) + this.cellSize,
      this.cellSize * (this.boardSize - 1) + this.cellSize
    );

    this.graphics.lineStyle(1, 0x000000, 1);
    for (let i = 0; i < this.boardSize; i++) {
      const x = this.boardStartX + i * this.cellSize;
      const yStart = this.boardStartY;
      const yEnd = this.boardStartY + (this.boardSize - 1) * this.cellSize;
      this.graphics.beginPath();
      this.graphics.moveTo(x, yStart);
      this.graphics.lineTo(x, yEnd);
      this.graphics.strokePath();

      const y = this.boardStartY + i * this.cellSize;
      const xStart = this.boardStartX;
      const xEnd = this.boardStartX + (this.boardSize - 1) * this.cellSize;
      this.graphics.beginPath();
      this.graphics.moveTo(xStart, y);
      this.graphics.lineTo(xEnd, y);
      this.graphics.strokePath();
    }
  }

  private drawStone(row: number, col: number, player: Player) {
    const x = this.boardStartX + col * this.cellSize;
    const y = this.boardStartY + row * this.cellSize;
    const radius = this.cellSize * 0.4;

    if (player === 1) {
      this.graphics.fillStyle(0x000000, 1);
    } else {
      this.graphics.fillStyle(0xffffff, 1);
      this.graphics.lineStyle(1, 0x000000, 1);
      this.graphics.strokeCircle(x, y, radius);
    }
    this.graphics.fillCircle(x, y, radius);
  }

  private endGame(player: Player) {
    this.isGameOver = true;
    let msg = '';
    if (player === 1) msg = '黑子 勝利！';
    else if (player === 2) msg = '白子 勝利！';
    else msg = '平 局！';
    this.winnerText!.setText(msg);
  }

  private resetGame() {
    this.gomoku.reset();
    this.currentPlayer = 1;
    this.isGameOver = false;
    this.graphics.clear();
    this.drawBoard();
    this.winnerText!.setText('輪到 黑子 下');
  }

  update() {
    if (!this.isGameOver) {
      const text = this.currentPlayer === 1 ? '輪到 黑子 下' : '輪到 白子 下';
      this.winnerText!.setText(text);
    }
  }
}
