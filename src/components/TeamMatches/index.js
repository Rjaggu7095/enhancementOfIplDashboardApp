import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'

import LatestMatch from '../LatestMatch'
import MatchCard from '../MatchCard'
import PieChart from '../PieChart'

import './index.css'

const teamMatchesApiUrl = 'https://apis.ccbp.in/ipl/'

class TeamMatches extends Component {
  state = {
    isLoading: true,
    teamMatchesData: {},
  }

  componentDidMount() {
    this.getTeamMatches()
  }

  getFormattedData = data => ({
    id: data.id,
    umpires: data.umpires,
    result: data.result,
    manOfTheMatch: data.man_of_the_match,
    date: data.date,
    venue: data.venue,
    competingTeam: data.competing_team,
    competingTeamLogo: data.competing_team_logo,
    firstInnings: data.first_innings,
    secondInnings: data.second_innings,
    matchStatus: data.match_status,
  })

  getTeamMatches = async () => {
    const {id} = this.props.match.params
    const response = await fetch(`${teamMatchesApiUrl}${id}`)
    const data = await response.json()

    const formattedData = {
      teamBannerURL: data.team_banner_url,
      latestMatch: this.getFormattedData(data.latest_match_details),
      recentMatches: data.recent_matches.map(each =>
        this.getFormattedData(each),
      ),
    }

    this.setState({teamMatchesData: formattedData, isLoading: false})
  }

  getNoOfMatches = status => {
    const {latestMatch, recentMatches} = this.state.teamMatchesData
    const latest = latestMatch.matchStatus === status ? 1 : 0
    const recent = recentMatches.filter(match => match.matchStatus === status)
      .length
    return latest + recent
  }

  generatePieChartData = () => [
    {name: 'Won', value: this.getNoOfMatches('Won') || 0},
    {name: 'Lost', value: this.getNoOfMatches('Lost') || 0},
    {name: 'Drawn', value: this.getNoOfMatches('Drawn') || 0},
  ]

  renderLoader = () => (
    <div testid="loader" className="loader-container">
      <Loader type="Oval" color="#ffffff" height={50} />
    </div>
  )

  getRouteClassName = () => {
    const {id} = this.props.match.params
    switch (id) {
      case 'RCB':
        return 'rcb'
      case 'KKR':
        return 'kkr'
      case 'KXP':
        return 'kxp'
      case 'CSK':
        return 'csk'
      case 'RR':
        return 'rr'
      case 'MI':
        return 'mi'
      case 'SRH': // ✅ Corrected
        return 'srh'
      case 'DC':
        return 'dc'
      default:
        return ''
    }
  }

  renderRecentMatchesList = () => {
    const {recentMatches} = this.state.teamMatchesData
    return (
      <ul className="recent-matches-list">
        {recentMatches.map(match => (
          <MatchCard key={match.id} matchDetails={match} />
        ))}
      </ul>
    )
  }

  renderTeamMatches = () => {
    const {teamBannerURL, latestMatch} = this.state.teamMatchesData

    return (
      <div className="responsive-container">
        <img src={teamBannerURL} alt="team banner" className="team-banner" />
        <LatestMatch latestMatchData={latestMatch} />
        <h1 className="latest-match-heading">Team Statistics</h1>
        <PieChart data={this.generatePieChartData()} />
        {this.renderRecentMatchesList()}
        <Link to="/">
          <button type="button">Back</button>
        </Link>
      </div>
    )
  }

  render() {
    const className = `team-matches-container ${this.getRouteClassName()}`
    return (
      <div className={className}>
        {this.state.isLoading
          ? this.renderLoader()
          : this.renderTeamMatches()}
      </div>
    )
  }
}

export default TeamMatches
