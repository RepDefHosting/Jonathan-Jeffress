import { useStaticQuery, graphql } from 'gatsby'
import { getValidDates } from '../utils'

export default () => {
  const data = useStaticQuery(
    graphql`
      query QueryRecentPhotos {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          filter: {
            frontmatter: {
              templateKey: { eq: "gallery-post" }
              published: { eq: true }
            }
          }
          limit: 4
        ) {
          edges {
            node {
              fields {
                slug
                gitAuthorTime
                gitCreatedTime
              }
              frontmatter {
                date(formatString: "MMM D, YYYY")
                pageTitle
                excerpt
                featuredImage {
                  src {
                    childImageSharp {
                      fluid {
                        originalName
                      }
                      original {
                        height
                        width
                      }
                    }
                  }
                  m: src {
                    childImageSharp {
                      fluid(maxWidth: 500, maxHeight: 664) {
                        ...GatsbyImageSharpFluid_withWebp
                        originalName
                      }
                      original {
                        height
                        width
                      }
                    }
                  }
                  d: src {
                    childImageSharp {
                      fluid(maxWidth: 1000, maxHeight: 664) {
                        ...GatsbyImageSharpFluid_withWebp
                        originalName
                      }
                      original {
                        height
                        width
                      }
                    }
                  }
                  alt
                }
              }
            }
          }
        }
      }
    `,
  )
  if (
    data &&
    data.allMarkdownRemark &&
    data.allMarkdownRemark.edges &&
    data.allMarkdownRemark.edges.length > 0
  ) {
    return data.allMarkdownRemark.edges.map(({ node }) => {
      const {
        frontmatter: { featuredImage, pageTitle, date: userDate, excerpt },
        fields: { slug, gitAuthorTime, gitCreatedTime },
      } = node
      const { date, dateModified } = getValidDates(
        userDate,
        gitAuthorTime,
        gitCreatedTime,
      )
      return {
        image: !!featuredImage ? featuredImage : null,
        slug,
        pageTitle,
        date,
        dateModified,
        excerpt
      }
    })
  } else {
    return []
  }
}
