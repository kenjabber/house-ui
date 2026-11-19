import { render, screen } from '@testing-library/react'
import { Table, TableDetailRow } from './Table'

describe('TableDetailRow', () => {
  it('is one cell spanning the row, with the detail class', () => {
    render(
      <Table>
        <tbody>
          <tr className="hu-row--clickable hu-row--selected">
            <td>/projects</td>
            <td>2 groups</td>
          </tr>
          <TableDetailRow colSpan={2} aria-label="Access to /projects">
            <p>editor</p>
          </TableDetailRow>
        </tbody>
      </Table>,
    )
    const row = screen.getByRole('row', { name: 'Access to /projects' })
    expect(row).toHaveClass('hu-row--detail')
    const cell = row.querySelector('td')!
    expect(row.children).toHaveLength(1)
    expect(cell).toHaveAttribute('colspan', '2')
    expect(cell).toHaveTextContent('editor')
  })
})
