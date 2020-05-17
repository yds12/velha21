const cardUtil = require('../src/card-util')
const assert = require('assert')

describe('card-util', () => {
  it('should encode cards correctly', (done) => {
    const aceSpades = { suit: 0, value: 1 }
    const fiveHearts = { suit: 1, value: 5 }
    const kingDiamond = { suit: 2, value: 13 }
    const sevenClubs = { suit: 3, value: 7 }

    assert.equal(cardUtil.encodeCard(aceSpades), 13 * 0 + 1)
    assert.equal(cardUtil.encodeCard(fiveHearts), 13 * 1 + 5)
    assert.equal(cardUtil.encodeCard(kingDiamond), 13 * 2 + 13)
    assert.equal(cardUtil.encodeCard(sevenClubs), 13 * 3 + 7)
    done()
  })

  it('should decode cards correctly', (done) => {
    const threeSpades = 13 * 0 + 3
    const blackJack = 13 * 0 + 11
    const tenHearts = 13 * 1 + 10
    const aceDiamonds = 13 * 2 + 1
    const queenClubs = 13 * 3 + 12

    decoded3Spades = cardUtil.decodeCard(threeSpades)
    decoded11Spades = cardUtil.decodeCard(blackJack)
    decoded10Hearts = cardUtil.decodeCard(tenHearts)
    decoded1Diamonds = cardUtil.decodeCard(aceDiamonds)
    decoded12Clubs = cardUtil.decodeCard(queenClubs)

    assert.equal(decoded3Spades.suit, 0)
    assert.equal(decoded3Spades.value, 3)
    assert.equal(decoded11Spades.suit, 0)
    assert.equal(decoded11Spades.value, 11)
    assert.equal(decoded10Hearts.suit, 1)
    assert.equal(decoded10Hearts.value, 10)
    assert.equal(decoded1Diamonds.suit, 2)
    assert.equal(decoded1Diamonds.value, 1)
    assert.equal(decoded12Clubs.suit, 3)
    assert.equal(decoded12Clubs.value, 12)

    done()
  })
})
