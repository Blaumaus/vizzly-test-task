import React, {
  lazy, Suspense,
} from 'react'
import { Switch, Route } from 'react-router-dom'

import Header from 'components/Header'
import Footer from 'components/Footer'

import routes from 'routes'

const Dashboard = lazy(() => import('pages/Dashboard'))
const NotFound = lazy(() => import('pages/NotFound'))

const App = () => {
  return (
    <Suspense fallback={<></>}>
      {/* <Header /> */}
      <Suspense fallback={<></>}>
        <Switch>
          <Route path={routes.main} component={Dashboard} exact />
          <Route path='*' component={NotFound} />
        </Switch>
      </Suspense>
      {/* <Footer /> */}
    </Suspense>
  )
}

export default App
