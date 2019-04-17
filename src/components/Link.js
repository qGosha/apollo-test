import React, { Component } from 'react'
import { AUTH_TOKEN } from '../constants'
import { timeDifferenceForDate } from '../utils'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`

const DELETE_LINK_MUTATION = gql`
  mutation DeleteLinkMutation($id: ID!) {
    deleteLink(id: $id) {
      id
    }
  }
`

class Link extends Component {
  render() {
  const authToken = localStorage.getItem(AUTH_TOKEN)
  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{this.props.index + 1}.</span>
        {authToken && (
          <Mutation
            mutation={VOTE_MUTATION}
            variables={{ linkId: this.props.link.id }}
            update={(store, { data: { vote } }) =>
            this.props.updateStoreAfterVote(store, vote, this.props.link.id)}
            >
            {voteMutation => (
              <div className="ml1 gray f11" onClick={voteMutation}>
                ▲
              </div>
            )}
          </Mutation>
        )}
        {authToken && (
          <Mutation
            mutation={DELETE_LINK_MUTATION}
            variables={{ id: this.props.link.id }}
            update={(store, { data: { link } }) =>
            this.props._updateCacheAfterLinkDelete(store, this.props.link.id)}
            >
            {deleteLinkMutation => (
              <div className="ml1 gray f11" onClick={deleteLinkMutation}>
               ♻
              </div>
            )}
          </Mutation>
        )}
      </div>
      <div className="ml1">
        <div>
          {this.props.link.description} ({this.props.link.url})
        </div>
        <div className="f6 lh-copy gray">
          {this.props.link.votes.length} votes | by{' '}
          {this.props.link.postedBy
            ? this.props.link.postedBy.name
            : 'Unknown'}{' '}
          {timeDifferenceForDate(this.props.link.createdAt)}
        </div>
      </div>
    </div>
  )
}
}

export default Link
