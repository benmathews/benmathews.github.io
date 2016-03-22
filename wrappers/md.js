import React from 'react'
import moment from 'moment'
import DocumentTitle from 'react-document-title'
import { link } from 'gatsby-helpers'
import ReadNext from '../components/ReadNext'
import { rhythm } from 'utils/typography'
import { config } from 'config'

import '../css/zenburn.css'

class MarkdownWrapper extends React.Component {
  render () {
    const { route } = this.props
    const post = route.page.data

      let categories
      if (post.categories){
	  categories = post.categories.map((category) =>
					     <li style={{display:"inline-block", marginRight:rhythm(0.8), fontSize:"14px"}} >{category}</li>)
      }
      
    return (
      <DocumentTitle title={`${post.title} | ${config.blogTitle}`}>
        <div className="markdown">
            <h1>{post.title}</h1>
	    <ul style={{listStyle:"none"}}>{categories}</ul>
          <div dangerouslySetInnerHTML={{ __html: post.body }}/>
          <em
            style={{
              display: 'block',
              marginBottom: rhythm(2),
            }}
          >
            Posted {moment.unix(post.created).format('MMMM D, YYYY')}
          </em>
          <hr
            style={{
              marginBottom: rhythm(2),
            }}
          />
          <ReadNext post={post} pages={route.pages} />
          <p>
            Written by <strong>{config.authorName}</strong>. 
          </p>
        </div>
      </DocumentTitle>
    )
  }
}

MarkdownWrapper.propTypes = {
  route: React.PropTypes.object,
}

export default MarkdownWrapper

            // <img
            //   src={link('/kyle-round-small-pantheon.jpg')}
            //   style={{
            //     float: 'left',
            //     marginRight: rhythm(1/4),
            //     marginBottom: 0,
            //     width: rhythm(2),
            //     height: rhythm(2),
            //   }}
            // />
