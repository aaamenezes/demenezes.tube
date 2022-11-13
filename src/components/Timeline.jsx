import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'
import { createClient } from '@supabase/supabase-js'
import { ColorModeContext } from './ColorMode'
import { podcastService } from '../services/podcastService'
import { categorizePodcasts } from '../services/categorizePodcasts'

const StyledTimeline = styled.div`
  flex: 1;
  width: 100%;
  max-width: 1199px;
  padding: 16px;
  margin: 0 auto;
  overflow: hidden;

    h2 {
    font-size: 16px;
    margin-bottom: 16px;
    text-transform: capitalize;
  }

  img {
    aspect-ratio: 1/1;
    font-weight: 500;
    object-fit: cover;
    width: 100%;
    max-width: 210px;
    height: auto;
  }

  section {
    width: 100%;
    padding: 0;
    overflow: hidden;
    padding: 16px;

    div {
      display: grid;
      grid-gap: 16px;
      grid-template-columns: repeat(auto-fill,minmax(200px,1fr));
      grid-auto-flow: column;
      grid-auto-columns: minmax(200px,1fr);
      overflow-x: auto;
      scroll-snap-type: x mandatory;

      .podcast-item {
        position: relative;
        scroll-snap-align: center;

        &:hover {
          .remove-podcast {
            opacity: 1;
          }
        }

        .remove-podcast {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 2rem;
          height: 2rem;
          border: none;
          border-radius: 50%;
          font-size: 2rem;
          background-color: ${ ({ theme }) => theme.brand_50 };
          cursor: pointer;
          
          &:hover {
            background-color: ${ ({ theme }) => theme.brand_200 };
          }
          
          @media (min-width: 768px) {
            opacity: 0;
          } 
        }
      }

      a {
        color: currentColor;

        span {
          padding-top: 8px;
          display: block;
          padding-right: 24px;
        }
      }
    }
  }
`

const API_URL = 'https://bxfwuyweuulatsylxysg.supabase.co'
// eslint-disable-next-line max-len
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4Znd1eXdldXVsYXRzeWx4eXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjgxNjcxOTYsImV4cCI6MTk4Mzc0MzE5Nn0.tJqjs9FvT80--Abwe4qeowVPgpojMjymMKox_h9-_nw'
const supabase = createClient(API_URL, API_KEY)

export default function Timeline() {
  const { podcasts, setPodcasts } = useContext(ColorModeContext)

  function updateScreenPodcasts() {
    const service = podcastService()
    service.getAllPodcasts().then(response => {
      const uncategorizedPodcasts = response.data
      const categorizedPodcasts = categorizePodcasts(uncategorizedPodcasts)
      setPodcasts(categorizedPodcasts)
    })
  }

  function watchSupabaseChanges() {
    supabase
      .from('podcasts')
      .on('INSERT', updateScreenPodcasts)
      .on('DELETE', updateScreenPodcasts)
      .subscribe()
  }

  useEffect(() => {
    watchSupabaseChanges()
  }, [])

  // function removePodcast(id) {
  //   supabase
  //     .from('podcasts')
  //     .delete()
  //     .match({ id })
  //     .then(updateScreenPodcasts)
  // }

  return (
    <StyledTimeline>
      {podcasts.map(group => (
        <section
          key={`${ group.id }-${ Math.random() }`}
          style={{ marginBottom: '3rem' }}
        >
          <h2>{group.category}</h2>
          <div className='styled-scrollbar' style={{ paddingBottom: '2rem' }}>
            {group.podcasts.map(podcast => (
              <div className='podcast-item'>
                {/* <button
                  type='button'
                  className='remove-podcast'
                  onClick={() => removePodcast(podcast.id)}
                >
                  &times;
                </button> */}
                <a href={podcast.url} key={podcast.id}>
                  <img
                    src={podcast.thumb}
                    alt={`Thumbnail of ${ podcast.title }`}
                  />
                  <span>
                    {podcast.title}
                  </span>
                </a>
              </div>
            ))}
          </div>
        </section>
      ))}
    </StyledTimeline>
  )
}
