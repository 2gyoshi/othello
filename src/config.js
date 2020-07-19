const CONFIG = {
    whiteStone: 'white',
    blackStone: 'black',
    skill: {
        reverse: {
            name: 'reverse',
            description: 'ゲーム中に1回、1つの石を選んで色を変える。\nこの効果を使うターン、プレイヤーは石を置くことができない。',
        },
        double: {
            name: 'double',
            description: 'ゲーム中に1回、5ターン目以降に発動できる。\nこの効果を使うターン、プレイヤーは2回行動できる。',
        },
        block: {
            name: 'block',
            description: 'ゲーム中に1回、1つのマス選んで使用不能にする。\nこの効果を使うターン、プレイヤーは石を置くことができない。',
        }
    }
}

export default CONFIG;