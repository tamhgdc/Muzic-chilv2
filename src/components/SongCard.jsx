import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Dropdown, Menu, message, Modal } from 'antd'
import collectionAPI from 'api/collectionAPI'
import fallbackImage from 'assets/images/fallback.jpg'
import classNames from 'classnames'
import { addASong, addASongPriority, pushToSongList } from 'features/MusicPlayer/musicPlayerSlice'
import React, { Fragment, useEffect, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { renderArtistFromList } from 'utils'

function SongCard({ data = {} }) {
  const user = useSelector((state) => state.user.current)
  const idList = useSelector((state) => state.user.favoriteSongIdList)

  const [isFavorite, setIsFavorite] = useState(false)

  const history = useHistory()
  const dispatch = useDispatch()

  const queryClient = useQueryClient()

  const { imageURL, name, _id, userId } = data

  useEffect(() => {
    if (idList.some((item) => item === _id)) setIsFavorite(true)
    else setIsFavorite(false)
  }, [idList])

  const { mutate, isLoading: updateLoading } = useMutation(
    () => {
      if (isFavorite) return collectionAPI.deleteSongFromFavorite(_id)
      else return collectionAPI.addSongToFavorite({ songId: _id })
    },
    {
      onSuccess: () => {
        message.success('Cập nhật thành công')
        setIsFavorite(!isFavorite)
        queryClient.invalidateQueries('favorite-song-id-list')
      },

      onError: () => {
        message.error('Cập nhật thất bại')
      },
    }
  )

  const handleItemClick = () => {
    dispatch(pushToSongList(data))
  }

  const handleHeartClick = async (e) => {
    e.stopPropagation()
    if (updateLoading) {
      return
    }
    mutate()
  }

  const handlePlayClick = (e) => {
    e.stopPropagation()
    dispatch(pushToSongList(data))
  }

  const handleDownload = () => {}

  const handleAddToList = () => {
    dispatch(addASong(data))
  }

  const handleAddToListPriority = () => {
    dispatch(addASongPriority(data))
  }

  const handleAddToPlaylist = () => {}

  const menu = (
    <Menu>
      <Fragment>
        <Menu.Item key="0" onClick={handleDownload}>
          <div className="menu__item">
            <i className="bi bi-download"></i>
            <span>Tải xuống</span>
          </div>
        </Menu.Item>

        <Menu.Item key="1" onClick={handleAddToList}>
          <div className="menu__item">
            <i className="bi bi-skip-start-fill"></i>
            <span>Thêm vào danh sách phát</span>
          </div>
        </Menu.Item>

        <Menu.Item key="2" onClick={handleAddToListPriority}>
          <div className="menu__item">
            <i className="bi bi-tv"></i> <span>Phát tiếp theo</span>
          </div>
        </Menu.Item>

        <Menu.Item key="3" onClick={handleAddToPlaylist}>
          <div className="menu__item">
            <i className="bi bi-plus-square"></i>
            <span>Thêm vào playlist</span>  
          </div>
        </Menu.Item>
      </Fragment>
    </Menu>
  )

  return (
    <div className="col l-2-4 m-3 c-4 mb-30">
      <div className="row__item item--playlist" onClick={handleItemClick}>
        <div className="row__item-container flex--top-left">
          <div className="row__item-display br-5">
            <div
              className="row__item-img img--square bg-song"
              style={{
                background: `url('${imageURL}'), url('${fallbackImage}')`,
              }}
            ></div>
            <div className="row__item-actions">
              {
                <div className="action-btn btn--heart" onClick={handleHeartClick}>
                  <i
                    className={classNames('btn--icon icon--heart bi', {
                      'bi-heart': !isFavorite,
                      'bi-heart-fill primary': isFavorite,
                    })}
                  ></i>
                </div>
              }
              <div className="btn--play-playlist" onClick={handlePlayClick}>
                <div className="control-btn btn-toggle-play">
                  <i className="bi bi-play-fill"></i>
                </div>
              </div>
              <div onClick={(e) => e.stopPropagation()} title="Khác">
                <Dropdown overlay={menu}>
                  <div className="action-btn">
                    <i className="btn--icon bi bi-three-dots"></i>
                  </div>
                </Dropdown>
              </div>
            </div>
            <div className="overlay"></div>
          </div>
          <div className="row__item-info">
            <a href="#" className="row__info-name is-twoline">
              {name}
            </a>
            <h3 className="row__info-creator">{renderArtistFromList(data.artistList)}</h3>
          </div>
        </div>
      </div>
    </div>
  )
}

SongCard.propTypes = {}

export default SongCard