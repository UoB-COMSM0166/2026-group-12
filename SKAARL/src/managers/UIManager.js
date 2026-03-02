class UIManager {
  static display(player, score) {
    // 繪製愛心
    fill(255, 0, 0);
    textSize(30);
    textAlign(LEFT, TOP);
    let hearts = "";
    for (let i = 0; i < player.hearts; i++) {
      hearts += "❤️ ";
    }
    text(hearts, 20, 20);

    // 繪製分數
    fill(0);
    textSize(20);
    text("Score: " + score, 20, 65);
  }
}