import React, { useState, useRef } from 'react'
import styled, { css } from 'styled-components'
import './App.css'

const StyledContainer = styled.div`
display: flex;
flex-wrap: wrap;
`

const StyledBlock = styled.div`
  min-height: 200px;
  box-sizing: border-box;
  padding: 30px;
  width: calc(100% / 3);
  display: inline-block;
  &:nth-of-type(1){
    background-color: #999;
  }
  &:nth-of-type(2){
    background-color: #888;
  }
  &:nth-of-type(3){
    background-color: #777;
  }
  &:nth-of-type(4){
    width: 100%;
  }
`

const StyledFlex = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: calc(100% - 30px);
  margin-left: -30px;
  margin-top: -30px;
`

const StyledCard = styled.div`
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  min-height: 200px;
  margin-left: 30px;
  margin-top: 30px;
  border-radius: 5px;
  box-sizing: border-box;
  padding: 10px;
  ${({ activeId, id }) => {
    if (id === undefined || activeId === undefined) return css`border: 1px solid #ccc`
    return activeId === id ? css`border: 3px solid #000` : css`border: 1px solid #ccc`;
  }};
  &:hover{
    cursor: pointer;
    opacity: .5;
  }
`

const App = () => {
  const [columns, setColumns] = useState([
    {
      id: 'A',
      title: '鳥類',
      cards: [
      ],
    },
    {
      id: 'B',
      title: '哺乳類',
      cards: [
      ],
    },
    {
      id: 'C',
      title: '魚類',
      cards: [
      ],
    },
    {
      id: 'D',
      title: 'カード',
      cards: [
        {
          id: 'f',
          text: '鳥',
          type: 'D',
          path: 'https://db3.bird-research.jp/news/wp-content/uploads/2018/12/3cef7a893cec6af3e0cd42736323769d-768x714.jpg',
          answer: 'A',
          select: false
        },
        {
          id: 'd',
          text: 'ライオン',
          type: 'D',
          path: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Lion_waiting_in_Namibia.jpg',
          answer: 'B',
          select: false
        },
        {
          id: 'g',
          text: '魚',
          type: 'D',
          path: 'https://www.fugu-sakai.com/assets/uploads/2019/12/20191209fugu001.jpg',
          answer: 'C',
          select: false
        },
      ],
    },
  ])
  const [draggingCard, setDraggingCard] = useState({})
  const [clickFlg, setClickFlg] = useState(true)
  const [error, setError] = useState(false)
  const [judge, setJudge] = useState(false)
  const [submitFlg, setSubmitFlg] = useState(false)

  const handleDrop = (id) => {
    if (draggingCard.id === undefined) return
    if (clickFlg) {
      setClickFlg(false)
      setTimeout(() => {
        setClickFlg(true)
      }, 100);
      let cardsItems = [...columns]

      if (!draggingCard || draggingCard === {}) return
      console.log('a')
      console.log(draggingCard)
      const dragCard = cardsItems.filter(cardsItem => {
        const flg = draggingCard.type === cardsItem.id ? true : false
        if (id === cardsItem.id && !flg) {
          const editDraggingCard = {
            ...draggingCard,
            type: id
          }
          cardsItem.cards = [
            ...cardsItem.cards,
            editDraggingCard
          ]
          return cardsItem
        }
        if (id !== cardsItem.id && flg) {
          cardsItem.cards = cardsItem.cards.filter(v => v.id !== draggingCard.id)
          return cardsItem
        }
        return cardsItem
      })
      setColumns([...dragCard])
      setDraggingCard({})
    }
  }

  const handleSetCard = ({ id, text, type, path, answer }) => {
    if (clickFlg) {
      setClickFlg(false)
      setTimeout(() => {
        setClickFlg(true)
      }, 100);
      setDraggingCard({ id, text, type, path, answer })
    }
  }

  const handleSubmit = () => {
    console.log(columns[columns.length - 1].cards)
    if (columns[columns.length - 1].cards === []) {
      setError(true)
      return
    }
    let answerFlg = true
    for (let i = 0; i < columns.length - 1; i++) {
      const flg = columns[i].cards.every((v) => columns[i].id === v.id)
      console.log(false)
      if (!flg) {
        answerFlg = false
        break;
      }
    }
    setSubmitFlg(true)
    setJudge(answerFlg)
  }

  return (
    <StyledContainer >
      {columns.map(({ id, title, cards }, index) => {
        return (
          <StyledBlock
            key={id}
          >
            <p>{title}</p>
            <DropArea
              onDrop={handleDrop}
              id={id}
              cardId={draggingCard}
            >
              <StyledFlex>
                {
                  cards.map(({ id, text, type, path, answer }, i) => {
                    return (
                      <Card
                        id={id}
                        text={text}
                        key={i}
                        type={type}
                        answer={answer}
                        path={path}
                        activeId={draggingCard.id}
                        onClick={handleSetCard}
                      />
                    )
                  })
                }
              </StyledFlex>
            </DropArea>
          </StyledBlock>
        )
      })}
      {error ? <p style={{ width: '100%' }} >使用していないカードがあります</p> : <div></div>}
      <div>
        <button onClick={handleSubmit}>
          回答する
        </button>
      </div>
      {(submitFlg && judge) && <p style={{ width: '100%' }}>正解</p>}
      {(submitFlg && !judge) && <p style={{ width: '100%' }}>不正解</p>}
    </StyledContainer>
  )
}

const StyledFigure = styled.figure`
padding: 0;
margin: 0;
width: 100%;
display: inline-block;
`

const StyledImage = styled.div`
  background-size: cover;
  width: 100%;
  display: inline-block;
  &:before{
    content: "";
    padding: 75%;
    display: block;
  }
`

const Card = ({
  id,
  text,
  path,
  activeId,
  onClick,
  answer,
  type
}) => {
  return (
    <>
      <StyledCard
        onClick={
          () => {
            onClick({ id, text, type, path, answer })
          }
        }
        id={id}
        activeId={activeId}
      >
        <StyledFigure>
          <StyledImage
            style={{ backgroundImage: `url("${path}") ` }}
          />
          <figcaption>{text}</figcaption>
        </StyledFigure>
      </StyledCard>
    </>
  )
}

const StyledDrop = styled.div`
  height: calc(100% - 60px);
  width: 100%;
  display: inline-block;
  transition: all 50ms ease-out;
  border-radius: 6px;
  min-height: 200px;
  box-sizing: border-box;
  padding: 10px;
  border: dashed 3px transparent;
  ${({ cardId }) => {
    if (cardId.id !== undefined) {
      return css`
        &:hover{
          border: dashed 3px #000;
        }
      `
    }
  }}
  &:hover{
    cursor: pointer;
  }
`
const DropArea = ({
  children,
  onDrop,
  id,
  cardId
}) => {
  return (
    <StyledDrop
      onClick={
        e => {
          e.preventDefault()
          if (!cardId) return
          onDrop(id)
        }
      }
      cardId={cardId}
    >
      {children}
    </StyledDrop>
  )
}

export default App
